## Signed & Unsigned Values

00000010 -> 2 -> Unsiged binary digits

We can only store positive numbers in unsigned value and negative in signed value. 
Unsigned numbers have 0 at start of their binary digits and Unsigned numbers have 1.

exanmple:

10000000 -> 8 bit binary

If this binary is read as unsigned it will be 128 in decimal.
If same binary is read as signed then it's value will be in negative.

### How to convert signed values in negative numbers?

To convert signed values in -ve numbers, we need to take it's 2's complement.
To get 2's complement just flip the binary digits -> **10000000** will become **01111111** -> **127** in decimal.
Add an additional 1 to it -> **10000000** -> **128**.
Here, **10000000** will be read **-128** (-ve) as signed value because it has 1 at start.
If the same **10000000** is read as unsigned value it will be **128** (+ve)

*Tip - You can use Programmers Calculator for calculations.

**01111111** is the highest positive number we can store in 1 byte(8 bits) which is **127**. So from **00000000** to **01111111** will be same as both signed and unsigned. because they dont have 1 at start.

example -

signed - 127
unsigned - 127

signed - 10
unsigned - 10

If we want to convert it into negative values we need to flip binary digits and add 1 to it like we done before.

The signed and unsigned values will be same from 0 to 128. They will differ after 128.

Now lets take a 2's complement of **129**

Its binary value is **10000001** 

**10000001** -> Unsigned -> 129.

Now for negative signed value of **10000001**,
first flip the digits to get 2's complement -> **01111110** -> **126** in decimal.
Add 1 to it -> **01111111** -> **127** 
**10000001** as signed will be read aa **-127** in decimal. 

some more examples

signed   unsigned
241      -15
150      -106
128      -128

In negative, -5 greater than -10.
in that sense **-128** (01111111 -> 10000000) is the maximum we can store in 1 byte signed value. (smallest in +ve).
and **-1** (11111111 -> 00000000 -> 00000001 (add 1)) is the minimum we can store in 1 byte signed value. (biggest in +ve).