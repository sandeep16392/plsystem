using AutoMapper;
using PLSystem.DAL.DomainModels;
using PLSystem.DAL.EntityModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace PLSystem.DAL.Common
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<UserDm, User>();
            CreateMap<User, UserDm>();
            CreateMap<UserDetailsDm, User>();
            CreateMap<User, UserDetailsDm>();
            CreateMap<User, UserListDm>();
            CreateMap<UserListDm, User>();
        }
    }
}
