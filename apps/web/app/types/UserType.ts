type UserType = {
  id: number;
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  isActive: boolean;
};

export default UserType;
