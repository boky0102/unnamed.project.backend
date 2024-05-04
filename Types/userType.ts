export interface User {
  uid: string;
  username: string;
  token: string;
  fieldOfStudy: string;
  contributions: number;
  discordid: string,
  avatarid: string,
}

interface CompSciStudent extends User {
  degree: 'Bachelor' | 'Master';
  coursesPassed: number;
  semestersComplete: number;
}

interface DataScienceStudent extends User {
  degree: 'Bachelor' | 'Master';
  coursesPassed: number;
  semestersComplete: number;
}

interface EngineeringStudent extends User {
  degree: 'Bachelor' | 'Master';
  coursesPassed: number;
  semestersComplete: number;
}