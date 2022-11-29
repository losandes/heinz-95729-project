# Program Name: Cervical Cancer Dataset ETL
# Name: Akihiko Sangawa
# Create Date: November 22, 2022 
# Data Source:
# http://archive.ics.uci.edu/ml/datasets/Cervical+cancer+%28Risk+Factors%29

import numpy as np
import pandas as pd
from pandas.core.api import isnull
import os

class  CervicalCancer():
    '''
    This class extract features cervial cancer patients from the csvs file risk_factors_cervical_cancer.csv.
    According to the ordered mode, return the corresponding modified dataset file.
    '''
    def __init__(self, data_path, file='risk_factors_cervical_cancer.csv', mode='array'):
        '''
        This program load cervial cancer CSV file, then modify some missing data, 
        and return as selected data type by users. 
        Argument: 
            data_path: CSV file's data path
            file: CSV file name. Default as "risk_factors_cervical_cancer.csv"
            mode: Return file type and you can select from numpy.ndarray or padas.DataFrame. 
                  Default as 'array'
        Return:
            Cervical cancer dataset
                Where select mode='array': cervical_cancer dataset as numpy array 
                Where select mode='dataframe':    cervical_cancer dataset as dataframe
        Dependency:
            Function: CervicalCancer.load_dataset, CervicalCancer.transform_dataset, CervicalCancer.convert_numpy
            Library:  Numpy, Pandas
        '''
        self.dataset = self.load_dataset(data_path, file)
        self.dataset = self.transform_dataset()

        if mode == 'array':
           self.column_names, self.dataset = self.convert_numpy()
        elif mode == 'dataframe':
           pass

    def load_dataset(self, data_path, file):
        '''
        This function load cervial cancer file from the csvs file risk_factors_cervical_cancer.csv.
        Argument: 
            data_path: CSV file's data path
            file: CSV file name. Default as "risk_factors_cervical_cancer.csv"
        Return:
            Cervical cancer DataFrame
        '''
        dataset = pd.read_csv(os.path.join(data_path, file))
        return dataset

    def transform_dataset(self):
        '''
        This function transform missing data to mean/median in cervial cancer dataset.
        Where the column is float/int data types, the missing data will be filled as column mean.
        Where the column is bool data type, the missing data will be filled as column median.
        Argument: 
            self.dataset: DataFrame cervical cancer dataset
        Return:
            Modified cervical cancer DataFrame
        '''
        # modify missing data to NaN
        self.dataset = self.dataset.where(self.dataset != '?')

        # convert integer/float cloumn data types to the corresponding data type
        self.dataset['Number of sexual partners'] = self.dataset['Number of sexual partners'].replace().astype(np.float32)
        self.dataset['First sexual intercourse']=self.dataset['First sexual intercourse'].replace().astype(np.float32)
        self.dataset['Num of pregnancies']=self.dataset['Num of pregnancies'].replace().astype(np.float32)
        self.dataset['Smokes (years)']=self.dataset['Smokes (years)'].replace().astype(np.float32)
        self.dataset['Smokes (packs/year)']=self.dataset['Smokes (packs/year)'].replace().astype(np.float32)
        self.dataset['Hormonal Contraceptives (years)']=self.dataset['Hormonal Contraceptives (years)'].replace().astype(np.float32)
        self.dataset['IUD (years)']=self.dataset['IUD (years)'].replace().astype(np.float32)
        self.dataset['STDs (number)']=self.dataset['STDs (number)'].replace().astype(np.float32)  

        # loop for modifying missing data NaN to column's mean/median
        for i in range(self.dataset.shape[1]):
            if self.dataset.iloc[:, i].dtype == int or self.dataset.iloc[:, i].dtype == np.float32:
                for j in range(self.dataset.shape[0]):
                    if np.isnan(self.dataset.iloc[j, i]):
                        self.dataset.iloc[j, i] = self.dataset.iloc[:, i].mean(dtype=np.float32)
            else: 
                for j in range(self.dataset.shape[0]):
                    if pd.isnull(self.dataset.iloc[j, i]):
                        self.dataset.iloc[j, i] = self.dataset.iloc[:, i].median()

        # Considering complemented data's inconsisstency 
        for i in range(self.dataset.shape[1]):
            for j in range(self.dataset.shape[0]):
                if i == 4 and self.dataset.iloc[j, i+1] > 0: # Smoke case
                    self.dataset.iloc[j, i] = 1
                if i == 9 and self.dataset.iloc[j, i+1] > 0: # IUD case
                    self.dataset.iloc[j, i] = 1
                if i == 12 and self.dataset.iloc[j, i] < 1: # Smoke case
                    self.dataset.iloc[j, i] = np.sum(self.dataset.iloc[j, i+1:i+14].astype(np.float32))

        # convert bool/int cloumn data types to the corresponding data type
        self.dataset['Smokes'] = self.dataset['Smokes'].replace().astype(np.bool8)
        self.dataset['Hormonal Contraceptives'] = self.dataset['Hormonal Contraceptives'].replace().astype(np.bool8)
        self.dataset['IUD'] = self.dataset['IUD'].replace().astype(np.bool8)
        self.dataset['STDs'] = self.dataset['STDs'].replace().astype(np.bool8)
        self.dataset['STDs:condylomatosis'] = self.dataset['STDs:condylomatosis'].replace().astype(np.bool8)
        self.dataset['STDs:cervical condylomatosis'] = self.dataset['STDs:cervical condylomatosis'].replace().astype(np.bool8)
        self.dataset['STDs:vaginal condylomatosis'] = self.dataset['STDs:vaginal condylomatosis'].replace().astype(np.bool8)
        self.dataset['STDs:vulvo-perineal condylomatosis'] = self.dataset['STDs:vulvo-perineal condylomatosis'].replace().astype(np.bool8)
        self.dataset['STDs:syphilis'] = self.dataset['STDs:syphilis'].replace().astype(np.bool8)
        self.dataset['STDs:pelvic inflammatory disease'] = self.dataset['STDs:pelvic inflammatory disease'].replace().astype(np.bool8)
        self.dataset['STDs:genital herpes'] = self.dataset['STDs:genital herpes'].replace().astype(np.bool8)
        self.dataset['STDs:molluscum contagiosum'] = self.dataset['STDs:molluscum contagiosum'].replace().astype(np.bool8)
        self.dataset['STDs:AIDS'] = self.dataset['STDs:AIDS'].replace().astype(np.bool8)
        self.dataset['STDs:HIV'] = self.dataset['STDs:HIV'].replace().astype(np.bool8)
        self.dataset['STDs:Hepatitis B'] = self.dataset['STDs:Hepatitis B'].replace().astype(np.bool8)
        self.dataset['STDs:HPV'] = self.dataset['STDs:HPV'].replace().astype(np.bool8)
        self.dataset['STDs: Time since first diagnosis'] = self.dataset['STDs: Time since first diagnosis'].replace().astype(np.float32)
        self.dataset['STDs: Time since last diagnosis'] = self.dataset['STDs: Time since last diagnosis'].replace().astype(np.float32)
        self.dataset['Dx:Cancer'] = self.dataset['Dx:Cancer'].replace().astype(np.bool8)
        self.dataset['Dx:CIN'] = self.dataset['Dx:CIN'].replace().astype(np.bool8)
        self.dataset['Dx:HPV'] = self.dataset['Dx:HPV'].replace().astype(np.bool8)
        self.dataset['Dx'] = self.dataset['Dx'].replace().astype(np.bool8)
        self.dataset['Hinselmann'] = self.dataset['Schiller'].replace().astype(np.bool8)
        self.dataset['Schiller'] = self.dataset['Schiller'].replace().astype(np.bool8)
        self.dataset['Citology'] = self.dataset['Citology'].replace().astype(np.bool8)
        self.dataset['Biopsy'] = self.dataset['Biopsy'].replace().astype(np.bool8)

        return self.dataset

    def convert_numpy(self):
        '''
        This function convert DataFrame of cervial cancer dataset into numpy array.
        Argument: 
            self.dataset: DataFrame cervical cancer dataset
        Return:
             Numpy array cervical cancer dataset: Column Name array, and data array
        '''
        array_column_names = self.dataset.columns.values
        array_dataset = self.dataset.to_numpy()
        return array_column_names, array_dataset

# Debug
if __name__ == '__main__':
    cc_df = CervicalCancer(data_path='/content/', file='risk_factors_cervical_cancer.csv', mode='dataframe')
    cc_array = CervicalCancer(data_path='/content/', file='risk_factors_cervical_cancer.csv', mode='array')
    csv_writer_df = cc_df.dataset.to_csv('df_risk_factors_cervical_cancer.csv')
    csv_writer_array = pd.DataFrame(data=cc_array.dataset, columns=cc_array.column_names).to_csv('array_risk_factors_cervical_cancer.csv', index=False)