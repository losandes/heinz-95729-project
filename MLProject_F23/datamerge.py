import pandas as pd

# Version 2: store tags as integers to improve performance

# Step 1: Loading Datasets
movies = pd.read_csv('/data/movie.csv')
genome_scores = pd.read_csv('/data/genome_scores.csv')

# Step 2: Merging and Preprocessing
# Filtering genome_scores for relevance > 0.75
filtered_genome_scores = genome_scores[genome_scores['relevance'] > 0.75]

# Grouping by movieId and collecting tagIds into a list
tagId_lists = filtered_genome_scores.groupby('movieId')['tagId'].apply(list)

# Merging with the movies dataset
movies = movies.merge(tagId_lists.to_frame(name='tagIds'), on='movieId', how='left')

# Step 3: Saving the Meta-dataset to CSV
movies.to_csv('/data/meta_dataset.csv', index=False)



















''' Version 1: store the tags as real txt
# Step 1: Loading Datasets
movies = pd.read_csv('archive/movie.csv')
genome_scores = pd.read_csv('archive/genome_scores.csv')
genome_tags = pd.read_csv('archive/genome_tags.csv')

# Step 2: Merging and Preprocessing
# Merging genome_scores with genome_tags to get tag names
genome_scores = genome_scores.merge(genome_tags, on='tagId')

# Filter to include only tags with a relevance score greater than 0.75
filtered_genome_scores = genome_scores[genome_scores['relevance'] > 0.75]

# Creating a tag string for each movie with filtered tags
tag_strings = filtered_genome_scores.groupby('movieId')['tag'].apply(lambda x: '|'.join(x))

# Merging with the movies dataset
movies = movies.merge(tag_strings.to_frame(name='tags'), on='movieId', how='left')

# Combine genres and filtered tag strings for feature engineering
movies['combined_features'] = movies['genres'] + '|' + movies['tags'].fillna('')

# Step 3: (Optional) Saving the Meta-dataset to CSV
movies.to_csv('archive/meta_dataset.csv', index=False)
'''


