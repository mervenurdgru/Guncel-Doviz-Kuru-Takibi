// Services/IAuthService.cs
using DovizTakipApi.Models;

namespace DovizTakipApi.Services
{
    public interface IAuthService
    {
        // Kullanıcı kaydı için şifreyi hash'ler
        void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);

        // Kullanıcı girişi için şifreyi doğrular
        bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);
    }
}