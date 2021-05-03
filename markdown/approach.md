# My Approach

- This was a lot of fun and more challenging since it is my first ever TypeScript Project. TypeScript is pretty 
  awesome and I am incorporating it with my current company 'as we speak' to enable our developers to create 
  maintainable code.
  
## The challenge
- The initial challenge was to identify where the speed was needed. Factors identified: 1. occasional data storage that is
not time critical. 2. Data retrieval that is time critical.
- With those two factors, it is clear to me that the data absolutely must be saved in a sorted manner to keep the 
  search big O down to (log) if possible.
- Now we know that we need sorted data stored in an easily accessible format. My first thought was to use a tree, and I 
  was actually thinking binary tree. However; after researching how the contiguous CIDR methodology is applied to the 
  provided ip blacklist, I decided to use a Radix tree with a modified quick sort method.
- Structure: Top level array of __Nodes__ is where it all starts and is referred to as "a level nodes." Each Node 
  consists of a value (dotted decimal value for that level), level (one for each dotted decimal section to include 
  the "a level" so 0 - 4, prefix (CIDR /prefix decimal value), childNodes (array of nodes underneath this decimal value)
- Sorting: Each childNodes array is sorted in ascending order of their decimal value. Prefix is stored in the very 
  bottom of the tree associated with the fourth dotted decimal value.
- Searching: The search looks for an the closest ip address in the list that is equal to, or less than the ip being 
searched on. If it is equal, then true is returned. If the address found is less than the one being searched for, then 
  the difference is determined, along with the prefix using log2 operations. If the calculated prefix is smaller than or
  equal to the one found in the tree, then the address is blocked and true is returned.
- The final "issue" was to deploy as a lambda or api. I chose API for the following reason:
  - The IP blacklist documentation recommended pulling from each list directly when deployed to production. The process
    that I would use to maintain the list and keep the actual tree updates to the minimum would include the use of a 
    database and (at least) two dedicated EC2 instances to separated the list management from the actual list (tree)
    structure. Future development would include API endpoints to add and remove arrays of ip addresses from the tree so
    the current Classes and basic routing structure is build to grow towards that,
  
- Trie visual using 5.188.10.0/23, 5.188.206.0/24, 10.0.0.0/8, 13.90.196.81, 14.128.136.68 & 14.192.4.35

- a (0 index) level nodes:   [5, 10, 13, 14]
- b (1 index) level nodes: 5 -> [188]  10 -> [0]  13 -> [90] 14 -> [128, 192]
- c (2 index) level nodes: 5.188 -> [10, 206] 10.0 -> [0] 13.90 -> [196] 14.128 -> [136] 14.192 -> [4]
- d (3 index) level nodes: 5.188.10 -> [0 prefix: 23] 5.188.206 -> [0 prefix 24] 10.0.0 -> [0 prefix 8] 13.90.196 -> [81] 
14.128.136 -> [68] 14.192.4 -> [35]
  
    

### Effort involved
  - Learning TypeScript: I would estimate just over 20 hours using the TS docs, several tutorials and some common 
    algorithms to get a good understanding of the differences between it and vanilla Node/JavaScript.
    - My schedule includes full time employment M - F and instructing DUs full stack continuing education class in the 
      evenings on Monday and Wednesday as well as several hours during the day on Saturday so the extra time was spread 
      out from when I learned the challenge was in TypeScript for about 1.5 weeks to shortly after I was assigned 
      two developers, a Slack channel and officiall presented with the application.
- Coding started last Thursday - I took a day of vacation and was able to get about 5 hours in
    - I was able to get some more time in over the weekend while visiting family in Florida (mostly on the plane) so 
    another 4 hours or so.
    - This week between Sunday night and tonight (Tuesday), I would say another 6 to 8 hours. About half of that was
    working on the AWS deployment using Packer and Terraform. The other half was troubleshooting a logic error (less 
      than vs. greater than - :( )
- Documentation
    - While I develop a plan up front, comment in code and add some doc blocks / process markdowns while developing, I 
    like to come back at the end and tidy things up so that will be another couple of hours.
    