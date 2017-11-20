Frequent Pattern Mining
=======================

This FP-Growth Tree was built following the description of the algorithm in [Data Mining Algorithms In R/Frequent Pattern Mining/The FP-Growth Algorithm](https://en.wikibooks.org/wiki/Data_Mining_Algorithms_In_R/Frequent_Pattern_Mining/The_FP-Growth_Algorithm). One key difference between this implementation and what is described is that this implementation keeps an array of references in the Header table. This makes the references easier to traverse, and can be sorted to achieve a similar traversal to the graphic relationships (parent-child) that are described in the algoritm.

The FpTreeMiner is incomplete. The comments in that file are derived from "Algorithm 2: FP-Growth" from the same article.

