using System;
using System.Collections.Generic;
using System.Text;

namespace OvertimeReport.DataProvider {
    public interface IOvertimeRepository<T> where T : class {
        List<T> GetAll();
        void Add(T entity);
        void Delete(int id);
    }
}
