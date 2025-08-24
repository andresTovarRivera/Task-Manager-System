using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskSystem.Server.Models;

namespace TaskSystem.Server.Configurations
{
    public class TaskDataConfiguration : IEntityTypeConfiguration<TaskData>
    {
        public void Configure(EntityTypeBuilder<TaskData> builder)
        {
            builder.ToTable("Tasks");

            builder.HasKey(x => x.Id);

            builder.Property(t => t.Title).HasMaxLength(200).IsRequired();
            builder.Property(t => t.Description).HasMaxLength(2000);
        }
    }
}
