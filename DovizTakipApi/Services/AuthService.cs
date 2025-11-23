// Services/AuthService.cs
using System.Security.Cryptography;
using System.Text;

namespace DovizTakipApi.Services
{
    public class AuthService : IAuthService
    {
        // 1. Yeni bir şifre (ve salt) oluşturur
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                // HMACSHA512'nin anahtarını (Key) "Salt" olarak kullanıyoruz.
                // Bu, her kullanıcı için farklı ve rastgele bir anahtardır.
                passwordSalt = hmac.Key;

                // Verilen şifreyi bu "Salt" (Key) ile hash'liyoruz.
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        // 2. Verilen şifrenin, veritabanındaki hash ile eşleşip eşleşmediğini kontrol eder
        public bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            // Kullanıcının "Salt"ını kullanarak HMACSHA512'yi yeniden başlatıyoruz
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                // Giriş yapmaya çalıştığı şifreyi (password) aynı "Salt" ile hash'liyoruz
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

                // İki hash'in (yeni hesaplanan ve veritabanındaki)
                // birebir aynı olup olmadığını kontrol ediyoruz.
                return computedHash.SequenceEqual(passwordHash);
            }
        }
    }
}