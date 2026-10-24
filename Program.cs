var builder = WebApplication.CreateBuilder(args);

// Idagdag ang CORS para sa security at accessibility
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseDefaultFiles(); // Hahanapin nito ang index.html sa wwwroot
app.UseStaticFiles();  // Papayagan ang pag-serve ng CSS, JS, at Images

// API Endpoint para sa Impormasyon ng Resume
app.MapGet("/api/profile", () => new
{
    Name = "Jeralyn A. Mondijar",
    Title = "BSIT Student & Technical Support Specialist",
    Degree = "Bachelor of Science in Information Technology (3rd Year)",
    Address = "1789 San Lazaro St., Santa Cruz, Manila",
    Email = "mondijarjeralynjam081504@gmail.com",
    Phone = "09653775945",
    Socials = new
    {
        Instagram = "https://www.instagram.com/usrnmjam_?exln=MTl4YjduM3oyeTN1aw==",
        TikTok = "https://www.tiktok.com/@itz_mejammy?_r=1&_t=ZS-9AgiotgJRf4",
        Facebook = "https://www.facebook.com/share/1CAQwNAmdh/",
        LinkedIn = "https://www.linkedin.com/in/jeralyn-mondijar-834159386"
    }
});

// API Endpoint para sa Contact Form Submission
app.MapPost("/api/contact", (ContactMessage msg) =>
{
    if (string.IsNullOrEmpty(msg.Email) || string.IsNullOrEmpty(msg.Message))
    {
        return Results.BadRequest(new { message = "Kailangan ang Email at Mensahe." });
    }
    
    // Dito pwedeng i-save sa database o i-forward sa email
    return Results.Ok(new { message = "Maraming salamat! Naimbak na ang iyong mensahe." });
});

app.Run();

public record ContactMessage(string Name, string Email, string Subject, string Message);