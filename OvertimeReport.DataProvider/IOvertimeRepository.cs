using System;
using System.Collections.Generic;
using System.Text;

namespace OvertimeReport.DataProvider {
    public interface IOvertimeRepository<T> where T : class {
        List<T> GetAll();
        void Add(T entity);
        void Delete(int id);
        void AddRangeOfBreakdowns(List<T> entities);
        void UpdateRangeOfBreakdowns(List<T> entities);
        void Update(T entity);
    }
}
