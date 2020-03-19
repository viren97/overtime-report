using Microsoft.EntityFrameworkCore;
using OvertimeReport.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OvertimeReport.DataProvider {
    public class OvertimeRepository<T> : IOvertimeRepository<T> where T : class {
        private readonly OvertimeContext _context = null;
        public OvertimeRepository(OvertimeContext context) {
            _context = context;
        }

        public List<T> GetAll() {
            return _context.Set<T>().ToList();
        }

        public void Add(T entity) {
            _context.Add(entity);
            _context.SaveChanges();
        }
        public void Delete(int id) {
            var breakdown = _context.Set<T>().Find(id);
            _context.Remove(breakdown);
            _context.SaveChanges();
        }

        //public T GetById(object id) {
        //    return _context.Set<T>().Find(id);
        //}

        //public void Update(T entity) {
        //    _context.Entry(entity).State = EntityState.Modified;
        //    _context.SaveChanges();
        //}

    }
}
