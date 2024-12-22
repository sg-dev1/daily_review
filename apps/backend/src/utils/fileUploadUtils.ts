import { extname, join } from 'path';
import type { Request } from 'express';
import { UnsupportedMediaTypeException } from '@nestjs/common';

export const csvFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(
      new UnsupportedMediaTypeException('Only CSV files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const csvFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
): void => {
  //const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `data${fileExtName}`);
};

export const getCSVFile = (): string => {
  //const name = file.originalname.split('.')[0];
  const filePath = join(__dirname, '..', '..', 'uploads/csv', 'data.csv');
  return filePath;
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
): void => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
