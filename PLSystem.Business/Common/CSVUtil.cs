using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace PLSystem.Business.Common
{
    public static class CSVUtil<T>
    {
        public static string ExportToCSV(DataTable tbl, bool isHeaderRequired = true)
        {
            if (tbl == null || tbl.Columns.Count == 0)
                throw new Exception("Null or empty input table.");

            StringBuilder sw = new StringBuilder();
            if (isHeaderRequired)
            {
                for (var i = 0; i < tbl.Columns.Count; i++)
                {
                    sw.Append(tbl.Columns[i]);
                    if (i < tbl.Columns.Count - 1)
                    {
                        sw.Append(",");
                    }
                }
                sw.Append("\n");
            }

            foreach (DataRow dr in tbl.Rows)
            {
                for(var i=0; i<tbl.Columns.Count; i++)
                {
                    if (!Convert.IsDBNull(dr[i]))
                    {
                        string value = dr[i].ToString();
                        if (value.Contains(","))
                        {
                            value = string.Format("\"{}\"", value);
                            sw.Append(value);
                        }
                        else
                        {
                            sw.Append(dr[i].ToString());
                        }
                    }
                    if(i<tbl.Columns.Count - 1)
                    {
                        sw.Append(",");
                    }
                }
                sw.Append("\n");
            }
            return sw.ToString();
        }
        public static string ConvertHeaderRow(T data)
        {
            return string.Join(",", typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(x => x.Name).ToArray<string>());
        }
        public static string ConvertObjectToCSV(List<T> list)
        {
            PropertyInfo[] propInfos = typeof(T).GetProperties();
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i <= list.Count - 1; i++)
            {
                T item = list[i];
                for (int j = 0; j <= propInfos.Length - 1; j++)
                {
                    object o = item.GetType().GetProperty(propInfos[j].Name).GetValue(item, null);
                    if (o != null)
                    {
                        string value = o.ToString();

                        //Check if the value contans a comma and place it in quotes if so
                        if (value.Contains(","))
                        {
                            value = string.Concat("\"", value, "\"");
                        }

                        //Replace any \r or \n special characters from a new line with a space
                        if (value.Contains("\r"))
                        {
                            value = value.Replace("\r", " ");
                        }
                        if (value.Contains("\n"))
                        {
                            value = value.Replace("\n", " ");
                        }

                        sb.Append(value);
                    }

                    if (j < propInfos.Length - 1)
                    {
                        sb.Append(",");
                    }
                }

                sb.AppendLine();
            }
            return sb.ToString();
        }
    }
}
