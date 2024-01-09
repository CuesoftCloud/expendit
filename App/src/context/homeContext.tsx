"use client";

import { createContext, 
useContext, 
useEffect,
useState, 
useRef,
Dispatch, 
ReactNode, 
SetStateAction 
} from "react";

import { getIncomeApi } from '../API/APIS/incomeApi';
import { getCategoryApi } from '../API/APIS/categoryApi';
import { getExpenseApi, getMonthlyExpenseApi } from '../API/APIS/expenseApi';
import { getLocalStorageItem } from '@/utils/localStorage';
import { 
getBarChartApi, 
getAreaHomeChartApi, 
getPieChartApi, 
getLineChartApi 
} from '../API/APIS/reportApi';


export interface HomeContextProps {
  homeState: number;
  setHomeState: Dispatch<SetStateAction<number>>;
  newString: string;
  setNewString: Dispatch<SetStateAction<string>>;
  formError: string;
  setFormError:  Dispatch<SetStateAction<string>>;
  formSuccess: string;
  setFormSuccess:  Dispatch<SetStateAction<string>>;
  formLoading: boolean;
  setFormLoading:  Dispatch<SetStateAction<boolean>>;
  presentIncome: number;
  setPresentIncome: Dispatch<SetStateAction<number>>;
  totalExpense: number;
  setTotalExpense: Dispatch<SetStateAction<number>>;
  totalBalance: number;
  setTotalBalance: Dispatch<SetStateAction<number>>;
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  expenseData: any;
  setExpenseData:  Dispatch<SetStateAction<any>>;
  categories: any;
  setCategories: Dispatch<SetStateAction<any>>;
  barChart: any;
  setBarChart: Dispatch<SetStateAction<any>>;
  areaChart: any; 
  setAreaChart: Dispatch<SetStateAction<any>>;
  pieChart: any;
  setPieChart: Dispatch<SetStateAction<any>>;
  lineChart: any;
  setLineChart: Dispatch<SetStateAction<any>>;
  totalPage: number;
  setTotalPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

export interface HomeProviderProps {
  children: ReactNode;
};

const HomeContext = createContext<HomeContextProps | undefined>(undefined);

export const HomeProvider = ({ children }: HomeProviderProps) => {
  const storedValue: string | null = getLocalStorageItem("Expendit-user");
  const presentUser: string | null = storedValue !== null ? JSON.parse(storedValue) : null;
  
  const [ user, setUser ] = useState<any>(presentUser || null);
  const [homeState, setHomeState] = useState<number>(2);
  const [newString, setNewString] = useState<string>("Testing for string");
  const [categories, setCategories] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  // ---- Form states ----
  const [formError, setFormError] = useState<string>("");
  const [formSuccess, setFormSuccess] = useState<string>("");
  const [formLoading, setFormLoading] = useState<boolean>(false);
  // ---- Financial states ----
  const [presentIncome, setPresentIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [expenseData, setExpenseData] = useState<any>([]);
  // ---- Report states ----
  const [areaChart, setAreaChart] = useState<any>([]);
  const [barChart, setBarChart] = useState<any>([]);
  const [pieChart, setPieChart] = useState<any>([]);
  const [lineChart, setLineChart] = useState<any>([]);

  // ---- Handle Form States ----
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (formError !== "") {
        setFormLoading(false);
        setFormError("");
      }

      if (formSuccess !== "") {
        setFormLoading(false);
        setFormSuccess("");
      }
    }, 5000);

    return () => {
      clearTimeout(timerId);
    };
  }, [formError, formSuccess, formLoading]);

  // ---- Populate All User states onLoad ----
  useEffect(() => {
    let isMounted = true; 
    let retry = 0;
    let timeoutId: string | number | NodeJS.Timeout | undefined;
  
    async function getInitialData() {
      try {
        if (user !== null && isMounted) {
          const [
            userExpenseRes,
            totalMonthExpenseRes,
            totalMonthIncomeRes,
            categoryRes
          ] = await Promise.all([
            getExpenseApi(),
            getMonthlyExpenseApi(),
            getIncomeApi(),
            getCategoryApi()
          ]);
  
          if (isMounted) {
            if (userExpenseRes) {
              setExpenseData(userExpenseRes.results);
              setTotalPage(userExpenseRes.total_pages);
              setCurrentPage(userExpenseRes.page);
              console.log(userExpenseRes);
            }
  
            if (totalMonthExpenseRes) {
              setTotalExpense(totalMonthExpenseRes.totalExpense);
              console.log(totalMonthExpenseRes);
            }
  
            if (totalMonthIncomeRes) {
              setPresentIncome(totalMonthIncomeRes.totalIncome);
              console.log(totalMonthIncomeRes);
            }
  
            if (categoryRes) {
              setCategories(categoryRes);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    getInitialData();

    if(retry < 2){
      retry ++;

      timeoutId = setTimeout(() => {
        getInitialData();
      }, 5000)
    }
  
    return () => { 
      isMounted = false;
      clearTimeout(timeoutId)
    };
  }, [user]);
  

   // ---- Populate All Report states onLoad ----
   useEffect(() => {
     let timeoutId: string | number | NodeJS.Timeout | undefined;
     let isMounted = true;
     let retry = 0;

    async function getInitialReportsData() {
      try {
        if(user !== null || isMounted){
          const [
            areaChartRes,
            barChartRes,
            pieChartRes,
            lineChartRes 
          ] = await Promise.all([
            getAreaHomeChartApi(),
            getBarChartApi(),
            getPieChartApi(),
            getLineChartApi()
          ]);
  
          if(isMounted){
            if(areaChartRes){
              setAreaChart(areaChartRes);
              console.log(areaChartRes)
            };
    
            if(barChartRes){
              setBarChart(barChartRes)
              console.log(barChartRes)
            }
    
            if(pieChartRes){
              setPieChart(pieChartRes);
              console.log(pieChartRes)
            };
    
            if(lineChartRes){
              setLineChart(lineChartRes);
              console.log(lineChartRes)
            };
          }
        }

      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    }

    getInitialReportsData();

    if(retry < 2){
      retry ++;

      timeoutId = setTimeout(() => {
        getInitialReportsData();
      }, 5000)
    }
  
    return () => { 
      isMounted = false;
      clearTimeout(timeoutId)
    };
  }, [user]);

  return (
    <HomeContext.Provider
      value={{ 
        homeState, 
        setHomeState, 
        newString, 
        setNewString,
        formError, 
        setFormError,
        formSuccess, 
        setFormSuccess,
        formLoading, 
        setFormLoading,
        presentIncome, 
        setPresentIncome,
        user, 
        setUser,
        expenseData, 
        setExpenseData,
        categories, 
        setCategories,
        totalExpense, 
        setTotalExpense,
        totalBalance, 
        setTotalBalance,
        barChart, 
        setBarChart,
        areaChart,
        setAreaChart,
        pieChart,
        setPieChart,
        lineChart,
        setLineChart,
        totalPage,
        setTotalPage,
        currentPage,
        setCurrentPage,
        currentStep,
        setCurrentStep
       }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within a AppProvider");
  }
  return context;
};
