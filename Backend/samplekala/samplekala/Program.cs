using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using samplekala.Data;
using samplekala.Repositories;
using samplekala.Service;
using System.Text;

namespace samplekala
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ========================
            // Core services
            // ========================
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();



            // ========================
            // Database (🔥 THIS WAS MISSING)
            // ========================
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(
                        builder.Configuration.GetConnectionString("DefaultConnection")
                    )
                )
            );

            // ========================
            // Repositories
            // ========================
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<IQuotationRepository, QuotationRepository>();

            // ========================
            // Services
            // ========================
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<ProductService>();
            builder.Services.AddScoped<QuotationService>();
            builder.Services.AddScoped<OrderService>();


            // ========================
            // CORS
            // ========================
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // ========================
            // JWT Authentication
            // ========================
            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes("Your_Very_Long_Secret_Key_Here_12345")
                        )
                    };
                });

            var app = builder.Build();

            // ========================
            // Middleware
            // ========================
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }
    }
}
