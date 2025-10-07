import axios from 'axios';
import { config } from '../config/env';

const API_URL = config.api.baseUrl;

export interface ResultData {
  studentId: string;
  courseCode: string;
  grade: string;
  semester: string;
}

export interface Result extends ResultData {
  timestamp?: string;
  updatedAt?: string;
}

export const addResult = async (data: ResultData) => {
  const res = await axios.post(`${API_URL}/add`, data);
  return res.data;
};

export const getResult = async (studentId: string, courseCode: string, semester: string) => {
  const res = await axios.get(`${API_URL}/get`, {
    params: { studentId, courseCode, semester }
  });
  return res.data;
};

export const updateResult = async (studentId: string, courseCode: string, semester: string, newGrade: string) => {
  const res = await axios.put(`${API_URL}/update`, {
    studentId,
    courseCode,
    semester,
    newGrade
  });
  return res.data;
};
