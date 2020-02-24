using PLSystem.DAL.Contracts;
using PLSystem.DAL.Data;
using PLSystem.DAL.EntityModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;


namespace PLSystem.DAL.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            this._context = context;
        }
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash;
            byte[] passwordSalt;

            CreatePasswordHash(password, out passwordSalt, out passwordHash);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            //user.UserGroups = 
            //var userGroup = _context.UserGroups.Where(x=>x.GroupName == )
            //user.UserGroups.Add(new UserUserGroup())

            foreach (var ug in user.UserGroups)
            {
                var ugp = _context.UserGroups.Where(x => x.Id == ug.UserGroup.Id).FirstOrDefault();
                ug.UserGroup = ugp;
            }

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName.Equals(username));
            if (user == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(user.PasswordHash, user.PasswordSalt, password))
            {
                return null;
            }

            return user;
        }
        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.UserName.Equals(username)))
                return true;
            return false;
        }
        private void CreatePasswordHash(string password, out byte[] passwordSalt, out byte[] passwordHash)
        {
            using (var hash = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hash.Key;
                passwordHash = hash.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(byte[] passwordHash, byte[] passwordSalt, string password)
        {
            using (var hash = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (var i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }
            return true;
        }
    }
}
