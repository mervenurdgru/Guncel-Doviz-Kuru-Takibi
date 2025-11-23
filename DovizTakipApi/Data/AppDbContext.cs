using Microsoft.EntityFrameworkCore;
using DovizTakipApi.Models;

namespace DovizTakipApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<FavoriteCurrency> FavoriteCurrencies { get; set; }
    }
}