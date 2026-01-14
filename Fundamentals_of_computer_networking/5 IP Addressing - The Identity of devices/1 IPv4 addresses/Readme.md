IPv4 address

1. IPv4 address is assign to devices who wants to connect with Internet. Without IPv4 address device cannot connect to Internet.

2. IPv4 is a 32 bit number. We see its as a decimal numbers like "192.168.0.1" but behind the scenes it is a binary numbers. Every group represents 8 bit. If we write 8 bit number like "1111 1111" it will be 255 in decimal. Means IPv4's minimum value can be 0.0.0.0 and maximum value can be 255.255.255.255. Every IPv4 address will be in this range.

Subnet Mask

1. Our router decides our Subnet Mask. Subnet Mask devides our IPv4 Address in two parts. e.g. 255.255.255.0

2. All the 1s and 0s in subnet mask are corresponding to 1s and 0s in our IPv4 address. All the 1s will be one part and all the 0s will be second part.

3. The 1s part in subnet mask is called network portion and the 0s part represents host portion. The network portion represents our network means all devices connected in our LAN will have same network portion means 1s part will be fixed in all devices. The remaining 0s part or host secion will be different for every device. That means maximum 255 devices are allowed in one network because limit is 255. e.g. In 192.168.0.1 the 192.168.0 will be same for all devices in network. and remaining part will be different. But 255 is a reserved number we can assinged upto 254 devices

4. In short subnet mask tells us how many bits are available. It is important that all the starting numbers in subnet mask should be 1s and ending numbers should be 0s.