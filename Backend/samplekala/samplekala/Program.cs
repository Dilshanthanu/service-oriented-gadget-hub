
using Microsoft.EntityFrameworkCore;
using samplekala.Data;
using samplekala.Repositories;
using samplekala.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

    namespace samplekala
    {
        public class Program
        {
            public static void Main(string[] args)
            {
                var builder = WebApplication.CreateBuilder(args);

                // Add services to the container.

                builder.Services.AddControllers();
                // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();
                // 1. Register the Repository
                builder.Services.AddScoped<IUserRepository, UserRepository>();

                // 2. Register the Service
                builder.Services.AddScoped<AuthService>();

                builder.Services.AddScoped<IUserRepository, UserRepository>();
                builder.Services.AddScoped<AuthService>();

            // Register Repositories
            builder.Services.AddScoped<IQuotationRepository, QuotationRepository>();

            // Register Services
            builder.Services.AddScoped<QuotationService>();

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            });
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            // Add this in Program.cs
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<ProductService>();




            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, // Set to true in production
        ValidateAudience = false, // Set to true in production
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Your_Very_Long_Secret_Key_Here_12345"))
    };
});

                var app = builder.Build();

                // Configure the HTTP request pipeline.
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }


            app.UseAuthentication(); // Who are you?
            app.UseAuthorization();  // Are you allowed to be here?

            app.MapControllers();
            app.Run();

            app.UseHttpsRedirection();

            app.UseCors("AllowFrontend");

            app.MapControllers();

                app.Run();
            }
        }
    }
