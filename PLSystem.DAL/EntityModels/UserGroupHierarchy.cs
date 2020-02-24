namespace PLSystem.DAL.EntityModels
{
    public class UserGroupHierarchy
    {
        public string UserGroupId { get; set; }
        public string HierarchyId { get; set; }
        public UserGroup UserGroup { get; set; }
        public Hierarchy Hierarchy { get; set; }
    }
}