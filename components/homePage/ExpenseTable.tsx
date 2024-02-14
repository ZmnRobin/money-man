interface ExpenseTableProps {
    expenses: Array<any>;
  }
  
  const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
    // Sort expenses by date
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group sorted expenses by date
    const groupedExpenses = sortedExpenses.reduce((acc, expense) => {
      const date = new Date(expense.date); // Convert date string to Date object
      const formattedDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }); // Format date as "DD Month, YYYY"
      acc[formattedDate] = acc[formattedDate] || [];
      acc[formattedDate].push(expense);
      return acc;
    }, {});
  
    // Get unique categories
    const uniqueCategories = [...new Set(expenses?.map(expense => expense?.category?.name))];
  
    return (
      <table className="table-auto border-collapse w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Date</th>
            {uniqueCategories.map(category => (
              <th key={category} className="border border-gray-300 px-4 py-2">{category}</th>
            ))}
            <th className="border border-gray-300 px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedExpenses).map(date => (
            <tr key={date}>
              <td className="border border-gray-300 px-4 py-2">{date}</td>
              {uniqueCategories.map(category => {
                const total = groupedExpenses[date]
                  .filter((expense: { category: { name: any; }; }) => expense?.category?.name === category)
                  .reduce((acc: any, expense: { amount: any; }) => acc + expense.amount, 0);
                return <td key={category} className="border border-gray-300 px-4 py-2">{total}</td>;
              })}
              <td className="border border-gray-300 px-4 py-2">
                {groupedExpenses[date].reduce((acc: any, expense: { amount: any; }) => acc + expense.amount, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default ExpenseTable;
  