# Neuro-Pic

Making E-commerce Immersive and Swifter through Neural Networks


## Getting Started

This repository provides a foundation for Team Neuropic E-Commerce Tech course project that includes image processing deep learning frameworks and a user interface. The instructions in this readme file will get you a copy of the project up and running on your local machine for testing purposes.

### Prerequisites

Python 3 should be installed in the system.

All the prerequisites are comprised of the python libraries leveraged to build neural network and perform clustering. Following is the list of libraries that are needed to be installed -
```
1. keras
2. numpy
3. pandas
4. glob
5. imageio
6. shutil
7. os
8. cv2
9. matplotlib
10. sklearn

```

### Installing

To install the above libraries write the following command for each library -
```
pip install packagename

E.g. pip install keras

for cv2 please use the command: python -m pip install opencv-python
```

Do the same for all the packages

```
To verify whether the packages have installed properly, try import packagename command in your python IDE
```

### Categorizing Product Images

1. The Raw Data for different apparal categories was fetched from open-source website - http://mmlab.ie.cuhk.edu.hk/projects/DeepFashion.html
2. This Raw Data is stored in Data folder of the project
3. The Data_Train_Valid_Split.py code is used to fetch the required images (with flat in their name) and divide them into Train and Validation sets (in Data\Model Data)
4. Categories that lack images or don't differ much in visuals are manually removed. Images that doesn't meet the requirement (e.g. with human in them) are manually removed
5. The Train and Valid images currently present in the folder are the result of the above steps
6. Then Test images folder is created (in Data\Model Data) and uncategorized images are added to them. These images can be changed as per requirements
7. Now we can run the Categorizing_Apparel.py code to predict the categories for the images in the Test folder
8. The above code creates a 'Predict' folder in the working directory with Test images categorized in folders according to their predictions

Note - Change the current working directory in Data_Train_Valid_Split.py and Categorizing_Apparel.py codes to the directory they are stored in


### Brief description of how the clustering algorithm works

1. All files from the train folder are read using glob after which each category is identified using the folder from which it is taken from.
2. For each category all images from that category is read as a numpy array and then resized for faster computation with low loss of information.
3. The resized images are fed into the clustering model and from which each clusters are determined for the image. The algorithm used here is K means with a cluster size of 3.
4. To improve readability a folder is created for each cluster and the images are transfered to each of those cluster folders.
5. Finally some images are transfered to the folder from which the UI picks it up for display.

Note - In the import section of the code the directory must be changed to neuropic i.e.(inside the folder neuropic)

### Steps for traversing the User Interface

1.	Open “index.html” in your browser - neuropic/UI/index.html
2.	index.html has sections corresponding to categories like Shirts, Tees, Shorts jackets etc.
3.	Click on “View More” button on the red jacket in the Jackets category (Note: Other category options are not available) 
4.	This will open another html page product-list-view-jackets-vests.html which contains sections corresponding to different types of jackets
5.	To view similar jackets corresponding to the given ones, click on “View More” button on the image (Note: Only the Red and Yellow jacket options on the top left and bottom left respectively are available)
6.	This will open another html page (either single-product-jacket-bright-red.html or single-product-jacket-bright-yellow.html depending on where the user clicked in the previous step)
7.	Scroll down to the “Best Sellers” section. Here the jackets similar to the jacket selected in the previous step are displayed (Note: These images are populated using the similarity clustering output) 

## Authors

* **Joeseph Sankoorikal**
* **Kartik Bansal**
* **Syed Danish Ahmed**


## Acknowledgments

* Keras documentation
* https://medium.com/@arindambaidya168/https-medium-com-arindambaidya168-using-keras-imagedatagenerator-b94a87cdefad
* https://colorlib.com/wp/wp-content/uploads/sites/2/winter-free-template.jpg

