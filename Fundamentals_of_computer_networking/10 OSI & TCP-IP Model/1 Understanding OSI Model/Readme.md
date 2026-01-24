Understanding OSI Model

To run networking efficiently and to divide work in different tasks, OSI model is made. OSI Model stands for Open Systems Interconnected Model. 
There are many works in Networking. IN OSI Model, these works are divided in 7 layers - 

7. Application Layer
6. Presentation Layer
5. Session Layer
4. Transport Layer
3. Network Layer
2. Data Link Layer
1. Physical Layer

It is not strictly neccessary that every device should follow these rules. It is just a general guideline.


7. Application Layer - Application layer acts as an interface between user and network. It presents data to the user in human readable form. It provides network services to applications.

6. Presentation Layer - In this layer many operations get performed on data like serialization, compression, encryption, translation etc. so that two systems can correctly understand eachother.

5. Session Layer - Session Layer helps to create a connection between two devices. There are no operations performed on data in this layer.

4. Transport Layer - In this layer data get divided into different segments. A number get added to each segment called port. Port identifies which request coming from which application. Port also tells the type of a request. There are two types of requests in transport layer - TCP & UDP.

3. Network Layer - In network layer a new address added on data segments called IP address(e.g. 142.3.2.1). Basically two IP addresses get assigned - destination & source IP address. Now this whole combination of port, request type and IP addresses will be called Packet. 

2. Data Link Layer - In data Link Layer MAC address(e.g. 1A-42-F9-6B) get assigned to Packet. There are also two MAC addresses - destination & source MAC address. Now combination of Packet and MAC addresses will be called Frame.

1. Physical Layer - In Physical layer this frame is converted into any physical/wifi signal like electrical, optic cabel or light.

After passing through all these layer each frame will reach to our router. Through all these layers request will get packed. Router will check the MAC address in packet is his MAC address, if it is then packet reached to correct destination. But router will find out that IP address is someone else. Router will then change the packet. It will change Source IP address to destination IP address means its own MAC address and Destination IP address to next machine/server MAC address

All the layers mentioned above are layer 1 and this router layer is layer 2. Every information added in each layer of layer 1 called headers. Layer 2 header get changed by router. layer 2's job is deliver data from one device to next. Frame will get changed in every device but packet will remain as it is. This delivery called Hop to Hop delivery. This process continues until our request reaches its final destination.  

Now unpacking will start. When Request reaches to destination it will get converted into a Frame. Request is a electric signal. The cable through this signal is travelling is a kind of physical layer itself. convertion is done by physical layer.

Now Data Link Layer will check is this frame is for this device by checking its MAC address. If it matches then frame reaches to Network Layer. Now Frame will become Packet. Network layer will check that if packet has same IP address as device, if matches packet will move to Transport Layer.

In Transport Layer packet becomes Segment.