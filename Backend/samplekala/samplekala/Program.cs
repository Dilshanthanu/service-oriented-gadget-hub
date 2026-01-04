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
            // Services
            // ========================

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Repositories
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();

            // Services
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<ProductService>();

                builder.Services.AddScoped<IUserRepository, UserRepository>();
                builder.Services.AddScoped<AuthService>();

            // Register Repositories
            builder.Services.AddScoped<IQuotationRepository, QuotationRepository>();

            // Register Services
            builder.Services.AddScoped<QuotationService>();

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

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
            // Middleware Pipeline
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