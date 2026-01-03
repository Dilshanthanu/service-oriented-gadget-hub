
    using Microsoft.EntityFrameworkCore;
    using samplekala.Data;
    using samplekala.Repositories;
    using samplekala.Service;

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

                var app = builder.Build();

                // Configure the HTTP request pipeline.
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                app.UseHttpsRedirection();

            app.UseCors("AllowFrontend");

            app.MapControllers();

                app.Run();
            }
        }
    }
