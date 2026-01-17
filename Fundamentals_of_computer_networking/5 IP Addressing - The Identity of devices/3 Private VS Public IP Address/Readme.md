private IP Address VS Public IP Address

1. private IP Addresses are can only be used in our own LAN. We cannot use it outside our LAN. It doesn't need internet.
2. Whereas public IP Addresses are accessible from any part of world. But it requires internet.

Why two categories

1. Before 1996, every device only have public IP Address. As Internet grows the no of device also keeps growing. IPv4 has a limit. That limit keeps getting closer and closer.

2. To tackle this situation IETF(Internet Engineering Task Force) who manages internet decide to make some IP Addresses reserved and make them private IP Addresses

3. When we open any website on internet from our computer it will first go to router then it will go to that website server and server will send response to router and router will send to the computer. 

4. Our computer cannot directly communicate with server cause our computer has Private IP Address and server has public IP Address. Here router becomes a medium cause router has Public IP Address so it can communicate with server and also router is part of your LAN so it can also communicate with your computer.

5. Means when we make request to server it will be first private. When router sends our request to server it becomes public and vice versa. This process is called NAT(Network Address Translation). But this process is used before 2010. before 2010 our router get public IP address free of cost. Now we need to pay for our router's IP Address.

6. In today's time our ISP use CG-NAT(Career Grade Network Address Translation). Our router initially be assigned a private IP Address by our ISP router. This ISP router will have public IP Address. Our router will be connected to the ISP router. So network request will go and return like this 
our device ⇆ our router ⇆ main ISP router ⇆ server