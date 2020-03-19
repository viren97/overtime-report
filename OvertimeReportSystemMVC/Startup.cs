using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OvertimeReport.DataProvider;
using OvertimeReport.Models;

namespace OvertimeReportSystemMVC {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddControllersWithViews();
            services.AddDbContext<OvertimeContext>(opt =>
             opt.UseSqlServer(Configuration.GetConnectionString("OvertimeContext"))
         );

            services.AddScoped<IOvertimeRepository<Attendance>, OvertimeRepository<Attendance>>();
            services.AddScoped<IOvertimeRepository<BreakDownHours>, OvertimeRepository<BreakDownHours>>();
            services.AddScoped<IOvertimeRepository<Employee>, OvertimeRepository<Employee>>();
            services.AddScoped<IOvertimeRepository<Site>, OvertimeRepository<Site>>();
            services.AddScoped<IOvertimeRepository<OvertimeType>, OvertimeRepository<OvertimeType>>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }
            else {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseDefaultFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
