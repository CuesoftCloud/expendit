import { API } from '../axiosSetup';
import { ExpenseProps } from '../types';
import { getLocalStorageItem } from '@/utils/localStorage';
import {
  getBarChartApi,
  getLineChartApi,
  getPieChartApi
} from './reportApi';

const userID = getLocalStorageItem('Expendit-userID') || null;
const user_id = userID ? JSON.parse(userID) : null;

export const expenseCreateApi = async ({
  completeForm,
  setFormError,
  setFormSuccess,
  setFormLoading,
  setExpenseData,
  setTotalExpense,
  setBarChart,
  setPieChart,
  setLineChart,
}: ExpenseProps) => {
  try {
    const payload = JSON.stringify(completeForm);
    console.log(completeForm);

    const { data, status } = await API.post('/expense/create', payload);

    if (data && status === 201) {
      console.log(data);
      setFormSuccess("Successful!");
      setFormLoading(false);

      try {
        setFormLoading(true);

        // RE-FETCH ALL FINANCIAL AND REPORT DATA AGAIN
        const [
          expenseRes,
          monthlyExpenseRes,
          barChartRes,
          pieChartRes,
          lineChartRes
        ] = await Promise.all([
          getExpenseApi(),
          getMonthlyExpenseApi(),
          getBarChartApi(),
          getPieChartApi(),
          getLineChartApi()
        ]);

        if (monthlyExpenseRes) setTotalExpense(monthlyExpenseRes.totalExpense);
        if (expenseRes) setExpenseData(expenseRes.results);
        if (barChartRes) setBarChart(barChartRes);
        if (pieChartRes) setPieChart(pieChartRes);
        if (lineChartRes) setLineChart(lineChartRes);

        setFormLoading(false);
      } catch (error) {
        setFormError("An error occurred, try again");
        setFormLoading(false);
      }
    }
  } catch (error) {
    console.log(error);
    setFormError("An error occurred, try again");
    setFormLoading(false);
  }
};

export const getExpenseApi = async () => {
  try {
    const { data } = await API.get(`/expense/user/${user_id}?page=1&per_page=10`);

    if (data) {
      console.log(data)
      return data;
    }
  } catch (error) {
    console.log(error)
  }
}

export const getMonthlyExpenseApi = async () => {
  try {
    const { data } = await API.get(`/expense/expenses/month/${user_id}`);

    if (data) {
      console.log(data)
      return data;
    }
  } catch (error) {
    console.log(error)
  }
}

export const deleteExpenseApi = async () => {

}

export const editExpenseApi = async () => {

}