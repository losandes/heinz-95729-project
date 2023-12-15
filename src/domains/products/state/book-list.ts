import { create } from 'zustand';

// Define the Book type
export type Book = {
  Title: string;
  Category: string;
  Price: string;
  Price_After_Tax: string;
  Tax_amount: string;
  Availability: string;
  Number_of_reviews: string;
  Book_Description: string;
  Image_Link: string;
  Stars: string;
};

// Define the type for the Book Store
export type BookStore = {
  books: Book[];
  currentBook: Book | null;
  setBooks: (books: Book[]) => void;
  setCurrentBook: (book: Book | null) => void;
  fetchBooks: () => void;
};

// Create the book store with zustand
export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  currentBook: null,
  setBooks: (books) => set({ books }),
  setCurrentBook: (book) => set({ currentBook: book }),

  // Function to fetch books (simulate fetching here)
  fetchBooks: async () => {
    try {
      // Simulate fetching data, replace with actual fetch call
      const fetchedBooks: Book[] = []; // Replace with fetched data
      set({ books: fetchedBooks });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  },
}));

export default useBookStore;
