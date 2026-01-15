IPv4 address

1. IPv4 address is assign to devices who wants to connect with Internet. Without IPv4 address device cannot connect to Internet.

2. IPv4 is a 32 bit number. We see its as a decimal numbers like "192.168.0.1" but behind the scenes it is a binary numbers. This 32 bit number is devided into 4 groups and separated by dot(.). Every group represents 8 bit. If we write 8 bit number like "1111 1111" it will be 255 in decimal. Means IPv4's minimum value can be 0.0.0.0 and maximum value can be 255.255.255.255. Every IPv4 address will be in this range.

8 bit = 1 octet

e.g. 192.168.10.0

2^7   2^6  2^5  2^4  2^3  2^2  2^1  2^0
128 + 64 + 32 + 16 + 8  + 4  + 2  + 1  === 255

suppose we want to calculate binary of 168.
to calculate we will find which numbers sum is 168 which are 128, 32 and 8
we will make them 1 and make other values 0.
Binary will look like this 1 0 1 0 1 0 0 0

IPv4 Classes

Class A -> 1.0.0.0 to 126.255.255.255
class B -> 128.0.0.0 to 191.255.255.255
class C -> 192.0.0.0 to 223.255.255.255
class D -> 224.0.0.0 to 239.255.255.255
class E -> 224.0.0.0 to 254.255.255.255

Subnet Mask

1. Our router decides our Subnet Mask. Subnet Mask devides our IPv4 Address in two parts. e.g. 255.255.255.0

2. All the 1s and 0s in subnet mask are corresponding to 1s and 0s in our IPv4 address. All the 1s will be one part and all the 0s will be second part.

3. The 1s part in subnet mask is called network portion and the 0s part represents host portion. The network portion represents our network means all devices connected in our LAN will have same network portion means 1s part will be fixed in all devices. The remaining 0s part or host secion will be different for every device. That means maximum 255 devices are allowed in one network because limit is 255. e.g. In 192.168.0.1 the 192.168.0 will be same for all devices in network. and remaining part will be different. But 255 is a reserved number we can assinged upto 254 devices.

4. In short subnet mask tells us how many bits are available. It is important that all the starting numbers in subnet mask should be 1s and ending numbers should be 0s.

5. They make a big mistake while making IPv4 addresses. They keep 127.0.0.0 reserved for Loopback(localhost) address. But one IP address is enough for running localhost. But they accidently reserved 2^24 IP addresses reserved. 