using Microsoft.EntityFrameworkCore;
using PLSystem.DAL.EntityModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Hierarchy> Hierarchies { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<Estimate> Estimates { get; set; }
        public DbSet<DailyPL> DailyPLs { get; set; }
        public DbSet<DailyTrade> DailyTrades { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserGroupHierarchy> UserGroupHierarchies { get; set; }
        public DbSet<UserGroup> UserGroups  { get; set; }
        public DbSet<UserUserGroup> UserUserGroups { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Hierarchy>()
                .HasKey(x => x.DEPT_LEAF_NODE);

            builder.Entity<Portfolio>()
                .HasKey(x => x.PortfolioId);

            builder.Entity<Portfolio>()
                .Property(et => et.PortfolioId)
                .ValueGeneratedNever();

            builder.Entity<User>()
                .HasKey(x => x.UserName);

            builder.Entity<UserGroup>()
                .HasKey(x => x.Id);

            builder.Entity<UserGroupHierarchy>()
                .HasKey(k => new { k.HierarchyId, k.UserGroupId });

            builder.Entity<UserGroupHierarchy>()
                .HasOne(x => x.Hierarchy)
                .WithMany(x => x.UserGroupHierarchies)
                .HasForeignKey(x => x.HierarchyId);

            builder.Entity<UserGroupHierarchy>()
                .HasOne(x => x.UserGroup)
                .WithMany(x => x.UserGroupHierarchies)
                .HasForeignKey(x => x.UserGroupId);

            builder.Entity<UserUserGroup>()
                .HasKey(k => new { k.UserName, k.UserGroupId });

            builder.Entity<UserUserGroup>()
                .HasOne(x => x.UserGroup)
                .WithMany(x => x.UserGroups)
                .HasForeignKey(x => x.UserGroupId);

            builder.Entity<UserUserGroup>()
                .HasOne(x => x.User)
                .WithMany(x => x.UserGroups)
                .HasForeignKey(x => x.UserName);
        }
    }
}
