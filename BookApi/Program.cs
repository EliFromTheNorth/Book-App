using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=books.db"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.MapGet("/books", async (AppDbContext db) =>
    await db.Books.ToListAsync()).RequireAuthorization();

app.MapPost("/books", async (Book book, AppDbContext db) =>
{
    db.Books.Add(book);
    await db.SaveChangesAsync();
    return Results.Created($"/books/{book.Id}", book);
}).RequireAuthorization();

app.MapPut("/books/{id}", async (int id, Book updated, AppDbContext db) =>
{
    var book = await db.Books.FindAsync(id);
    if (book is null) return Results.NotFound();
    book.Title = updated.Title;
    book.Author = updated.Author;
    book.PublishDate = updated.PublishDate;
    await db.SaveChangesAsync();
    return Results.Ok(book);
}).RequireAuthorization();

app.MapDelete("/books/{id}", async (int id, AppDbContext db) =>
{
    var book = await db.Books.FindAsync(id);
    if (book is null) return Results.NotFound();
    db.Books.Remove(book);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapGet("/citater", async (AppDbContext db) =>
    await db.Citater.ToListAsync()).RequireAuthorization();

app.MapPost("/citater", async (Citat citat, AppDbContext db) =>
{
    if (await db.Citater.CountAsync() >= 5)
        return Results.BadRequest("You can only have 5 quotes.");
    db.Citater.Add(citat);
    await db.SaveChangesAsync();
    return Results.Created($"/citater/{citat.Id}", citat);
}).RequireAuthorization();

app.MapPut("/citater/{id}", async (int id, Citat updated, AppDbContext db) =>
{
    var citat = await db.Citater.FindAsync(id);
    if (citat is null) return Results.NotFound();
    citat.Text = updated.Text;
    citat.Author = updated.Author;
    await db.SaveChangesAsync();
    return Results.Ok(citat);
}).RequireAuthorization();

app.MapDelete("/citater/{id}", async (int id, AppDbContext db) =>
{
    var citat = await db.Citater.FindAsync(id);
    if (citat is null) return Results.NotFound();
    db.Citater.Remove(citat);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapPost("/auth/register", async (AuthRequest request, AppDbContext db) =>
{
    if (await db.Users.AnyAsync(u => u.Username == request.Username))
        return Results.BadRequest("Username already exists.");

    var salt = RandomNumberGenerator.GetBytes(16);
    var hash = Rfc2898DeriveBytes.Pbkdf2(request.Password, salt, 100000, HashAlgorithmName.SHA256, 32);
    var passwordHash = $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";

    db.Users.Add(new User { Username = request.Username, PasswordHash = passwordHash });
    await db.SaveChangesAsync();
    return Results.Ok("User registered successfully.");
});

app.MapPost("/auth/login", async (AuthRequest request, AppDbContext db, IConfiguration config) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
    if (user is null) return Results.Unauthorized();

    var parts = user.PasswordHash.Split(':');
    var salt = Convert.FromBase64String(parts[0]);
    var storedHash = Convert.FromBase64String(parts[1]);
    var inputHash = Rfc2898DeriveBytes.Pbkdf2(request.Password, salt, 100000, HashAlgorithmName.SHA256, 32);

    if (!CryptographicOperations.FixedTimeEquals(storedHash, inputHash))
        return Results.Unauthorized();

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        issuer: config["Jwt:Issuer"],
        audience: config["Jwt:Audience"],
        claims: [new Claim(ClaimTypes.Name, user.Username)],
        expires: DateTime.UtcNow.AddHours(8),
        signingCredentials: creds
    );

    return Results.Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
});

app.Run();

class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Citat> Citater => Set<Citat>();
    public DbSet<User> Users => Set<User>();
}

class User
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
}

record AuthRequest(string Username, string Password);

class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Author { get; set; } = "";
    public int? PublishDate { get; set; }
}

class Citat
{
    public int Id { get; set; }
    public string Text { get; set; } = "";
    public string Author { get; set; } = "";
}
