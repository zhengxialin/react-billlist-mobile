export const billListData = {
    pay: [
      {
        type: 'foods',
        name: 'Food and drinks',
        list: [
          { type: 'food', name: 'Meal' },
          { type: 'drinks', name: 'Drinks' },
          { type: 'dessert', name: 'Dessert' },
        ],
      },
      {
        type: 'transport',
        name: 'Public Transport',
        list: [
          { type: 'taxi', name: 'Taxi' },
          { type: 'longdistance', name: 'Long distance' },
        ],
      },
      {
        type: 'recreation',
        name: 'Recreation',
        list: [
          { type: 'fitness', name: 'Body building' },
          { type: 'game', name: 'Video games' },
          { type: 'audio', name: 'Watching movie' },
          { type: 'travel', name: 'Traveling' },
        ],
      },
      {
        type: 'daily',
        name: 'Daily cost',
        list: [
          { type: 'clothes', name: 'Clothes' },
          { type: 'bag', name: 'Accessories' },
          { type: 'book', name: 'Reading' },
          { type: 'promote', name: 'Sales' },
          { type: 'home', name: 'Household' },
        ],
      },
      {
        type: 'other',
        name: 'Other payment',
        list: [{ type: 'community', name: 'Community fee' }],
      },
    ],
    income: [
      {
        type: 'professional',
        name: 'Working income',
        list: [
          { type: 'salary', name: 'Salary' },
          { type: 'overtimepay', name: 'Overtime pay' },
          { type: 'bonus', name: 'Bonus' },
        ],
      },
      {
        type: 'other',
        name: 'Other income',
        list: [
          { type: 'financial', name: 'Finance products' },
          { type: 'cashgift', name: 'Cash gift' },
        ],
      },
    ],
  }
  
  export const billTypeToName = Object.keys(billListData).reduce((prev, key) => {
    billListData[key].forEach(bill => {
      bill.list.forEach(item => {
        prev[item.type] = item.name
      })
    })
    return prev
  }, {})