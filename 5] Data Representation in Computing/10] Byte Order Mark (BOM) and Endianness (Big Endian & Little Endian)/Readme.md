## Byte Order Mark (BOM) and Endianness (Big Endian & Little Endian)

0x425A

there are two methods to store bytes.

42 5A    5A 42
0  1     0  1  => index

5A is a least significant byte => 2^0 (place value)
42 is a most significant byte => 2^1 (place value)

least significant byte will go to smallest index and most signifiant byte will go to biggest index.

1st method is mainly used by humans. 2nd method is the most efficient for computers. But computer can use both methods. 