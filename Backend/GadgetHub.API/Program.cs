using Microsoft.EntityFrameworkCore;
using GadgetHub.API.Data;
using GadgetHub.API.Repositories;
using GadgetHub.API.Services;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CORE SERVICES ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 2. DATABASE CONFIGURATION (MySQL) ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// --- 3. REPOSITORY REGISTRATION ---
// We use AddScoped so a new instance is created per HTTP request
builder.Services.AddScoped<IUserRepository, UserRepository>();

// --- 4. SERVICE REGISTRATION ---
builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddScoped<IQuotationService, QuotationService>(); // Uncomment when created

var app = builder.Build();

// --- 5. MIDDLEWARE PIPELINE ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Authorization is needed for Roles (Admin vs Customer)
app.UseAuthorization();

// This maps the Attribute Routes [Route("api/[controller]")] in your Controllers
app.MapControllers();

app.Run();