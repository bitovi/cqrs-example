export interface IStudent {
    userId: string;
    name?: string;
    email?: string;
    gender?: string;
    points?: number,
}

export interface AddStudentDTO {
    name: string
    email: string
    gender: string
};

export interface IUpdateStudentDTO {
    points: number,
    daysEarly: number,
    daysLate: number,
    attendanceRecord: Array<IAttendance>,
}

export interface IAttendance {
    arrivalTime: string;
    pointsGotten: number;
}

export interface IStudentCommand extends IStudent{
    command: string;
}

export interface IAttendanceCommand {
    userId: string;
    arrivalTime?: string
}