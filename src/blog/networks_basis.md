---
title: Network Fundamentals
pubDate: 2026-03-22
description:
  "A beginner-friendly guide to computer networking. The TCP/IP and OSI models,
  IP addressing, DNS, and essential network tools explained."
tags: ["networking", "fundamentals"]
isDraft: true
snippet:
  language: "bash"
  code: "ping -c 4 8.8.8.8"
---

## Introduction

Computer networks form the backbone of modern digital communication. Whether
you're browsing the web, sending an email, or streaming video, you're relying on
a complex system of protocols and technologies working together to transport
data reliably across the globe. Understanding how networks operate—from the
physical cables to the application layer—is essential for anyone working in
technology, cybersecurity, or software development. This guide explores the
fundamental concepts of computer networking, starting with two foundational
models that explain how communication happens across the internet.

## TCP/IP Model

The TCP/IP model is a practical, four-layer conceptual framework that describes
how modern internet communication works. Unlike more theoretical models, TCP/IP
is designed around the protocols actually used in the real world. Understanding
this model is crucial for grasping how data moves across networks.

1. **Application Layer**: This layer includes protocols that provide network
   services directly to user applications. When you access a website, send an
   email, or use a chat application, you're using protocols from this layer.
   Common examples include HTTP/HTTPS for web browsing, SMTP for sending emails,
   POP3 and IMAP for retrieving emails, and FTP for file transfer. These
   protocols define how applications communicate with each other over the
   network.

2. **Transport Layer**: Responsible for end-to-end communication between
   devices, this layer ensures that data is delivered reliably and in the
   correct order. Two primary protocols operate at this layer: TCP (Transmission
   Control Protocol) provides reliable, ordered delivery with error checking,
   making it suitable for applications like email and file transfer where
   accuracy matters. UDP (User Datagram Protocol) offers faster but unreliable
   delivery, making it ideal for real-time applications like video streaming and
   online gaming where speed matters more than perfection.

3. **Internet Layer**: This layer handles routing—determining the best path for
   data packets to travel across networks. The Internet Protocol (IP) is the
   primary protocol here, responsible for addressing and fragmenting data into
   packets. Every device connected to the internet has an IP address, which is
   used to identify and route data to the correct destination.

4. **Link Layer**: Also called the network interface or data link layer, this
   layer manages the physical transmission of data over network media. Protocols
   at this layer, such as Ethernet and Wi-Fi, define how data is formatted for
   transmission over physical cables or wireless signals. This is where your
   computer communicates directly with your router or network switch.

## OSI (Open Systems Interconnection) Model

The OSI model is a theoretical seven-layer framework that provides a
comprehensive view of how network communication works. Developed by the
International Organization for Standardization (ISO), it's more detailed than
the TCP/IP model and helps explain how different network technologies and
protocols interact.

1. **Application Layer**: This layer provides network services to applications
   and user interfaces. It includes protocols like HTTP, FTP, SMTP, DNS, and
   Telnet. When you interact with any network-enabled application, the
   application layer is handling the protocols that enable that interaction.

2. **Presentation Layer**: This layer is responsible for data translation,
   encryption, and compression. It ensures that data sent by the application
   layer of one system is readable and usable by the application layer of
   another system. For example, if one computer uses EBCDIC character encoding
   and another uses ASCII, the presentation layer handles the conversion. It
   also handles data encryption for secure transmission.

3. **Session Layer**: This layer manages sessions between applications. It
   establishes, maintains, and terminates connections between computers. Think
   of it as the layer that keeps conversations between applications organized—it
   handles things like user login sessions and dialogue control.

4. **Transport Layer**: Providing end-to-end communication and error recovery,
   this layer is equivalent to the TCP/IP transport layer. It includes protocols
   like TCP and UDP, and handles flow control, multiplexing, and error
   detection.

5. **Network Layer**: Responsible for routing data packets across networks, this
   layer determines the best path for data to travel. The Internet Protocol (IP)
   is the primary protocol at this layer, and it works with routing protocols
   like BGP and OSPF to direct traffic across the internet.

6. **Data Link Layer**: This layer handles physical addressing and framing of
   data. It defines how devices on the same network segment communicate with
   each other using MAC (Media Access Control) addresses. Common protocols
   include Ethernet, Wi-Fi (802.11), and PPP. This layer also manages error
   detection and handling at the frame level.

7. **Physical Layer**: The lowest layer, it's responsible for the actual
   physical transmission of raw bits over network media. This includes the
   physical cables (copper, fiber optic), wireless signals, connectors, and
   network interface cards. It defines electrical signaling, voltage levels, and
   physical specifications.

## TCP/IP vs OSI Models: A Comparison

While both models describe network communication, they differ in scope and
practical application. The TCP/IP model consists of four layers and reflects the
actual protocols used on the internet today. It's more practical and is what
modern networks actually implement. The OSI model, with seven layers, is more
conceptual and comprehensive—it provides a clearer understanding of each layer's
specific function, but not all layers correspond to actual protocols. Think of
the TCP/IP model as a blueprint of how the internet actually works, and the OSI
model as a more detailed manual for understanding networking concepts. In
practice, understanding both is valuable: the OSI model helps you grasp
fundamental networking concepts, while the TCP/IP model helps you understand
actual implementation.

## IP Addressing

Every device on a network needs a unique identifier to send and receive data.
This is where IP addresses come in. An IP address is a numerical label assigned
to each device on a network that uses IP for communication.

### IPv4

IPv4 (Internet Protocol version 4) is the most widely used version. An IPv4
address consists of four octets separated by dots, each octet ranging from 0
to 255. For example: `192.168.1.1`. This gives us a theoretical maximum of about
4.3 billion unique addresses, which seemed sufficient when IPv4 was designed in
1981 but is now insufficient for the number of internet-connected devices.

IP addresses are divided into classes and ranges:

- **Private ranges**: Used for internal networks and not routable on the public
  internet
  - 10.0.0.0 to 10.255.255.255
  - 172.16.0.0 to 172.31.255.255
  - 192.168.0.0 to 192.168.255.255

### IPv6

IPv6 (Internet Protocol version 6) was developed to address the shortage of IPv4
addresses. It uses 128-bit addresses, providing an astronomically larger address
space. IPv6 addresses are written as eight groups of hexadecimal digits
separated by colons, like `2001:0db8:85a3:0000:0000:8a2e:0370:7334`. With over
340 undecillion unique addresses, IPv6 can accommodate every conceivable device
on earth and beyond.

### Subnetting Basics

Subnetting divides an IP network into smaller logical subnetworks. This is
accomplished using a subnet mask, which determines which portion of an IP
address represents the network and which portion represents the host.

For example, in the address `192.168.1.100` with a subnet mask of
`255.255.255.0`:

- Network portion: `192.168.1.0`
- Host portion: `.100`
- Usable host addresses: `192.168.1.1` through `192.168.1.254`
- Broadcast address: `192.168.1.255`

CIDR notation provides a shorthand: `192.168.1.0/24` means the first 24 bits
define the network, leaving 8 bits for hosts.

## DNS: Domain Name Resolution

While IP addresses are essential for routing, humans prefer to use memorable
names. The Domain Name System (DNS) is the protocol that translates
human-friendly domain names into IP addresses.

When you type `www.example.com` into your browser, here's what happens behind
the scenes:

1. Your computer queries a DNS resolver (usually provided by your ISP)
2. The resolver queries a root nameserver, which directs it to the appropriate
   top-level domain (TLD) server
3. The TLD server directs the resolver to the authoritative nameserver for
   `example.com`
4. The authoritative nameserver returns the IP address associated with
   `www.example.com`
5. Your computer caches this result and uses the IP address to connect to the
   web server

DNS records come in several types:

- **A record**: Maps a domain to an IPv4 address
- **AAAA record**: Maps a domain to an IPv6 address
- **CNAME record**: Creates an alias for another domain
- **MX record**: Specifies mail servers for a domain
- **TXT record**: Stores text information, often used for verification

## TCP vs UDP: Key Differences

Both TCP and UDP are transport layer protocols, but they serve different
purposes:

### TCP (Transmission Control Protocol)

TCP is a **connection-oriented** protocol that guarantees reliable delivery:

- Establishes a connection before sending data (three-way handshake)
- Ensures all data arrives in the correct order
- Detects and retransmits lost packets
- Provides flow control and error checking
- Slower due to overhead, but more reliable

TCP is ideal for applications where accuracy is critical: web browsing (HTTP),
email (SMTP, POP3, IMAP), file transfer (FTP), and secure shell access (SSH).

### UDP (User Datagram Protocol)

UDP is a **connectionless** protocol that prioritizes speed over reliability:

- No connection establishment required
- Sends data immediately without guaranteeing delivery
- No automatic retransmission of lost packets
- Minimal overhead, making it faster
- Lower latency

UDP is preferred for real-time applications: video and audio streaming, online
gaming, VoIP, and DNS queries.

**Summary table:**

| Feature     | TCP                       | UDP                     |
| ----------- | ------------------------- | ----------------------- |
| Connection  | Connection-oriented       | Connectionless          |
| Reliability | Guaranteed delivery       | Best effort             |
| Order       | In-order delivery         | No ordering guarantee   |
| Speed       | Slower (reliable)         | Faster (lightweight)    |
| Overhead    | Higher                    | Lower                   |
| Use Cases   | Web, email, file transfer | Streaming, gaming, VoIP |

## HTTP/HTTPS: Brief Overview

HTTP (HyperText Transfer Protocol) is the foundation of the World Wide Web. It's
an application-layer protocol built on TCP that defines how messages are
formatted and transmitted between web clients (browsers) and servers.

HTTPS is the secure version of HTTP, using TLS/SSL encryption to protect data in
transit. This encryption prevents attackers from intercepting and reading
sensitive information like passwords and credit card numbers.

HTTP/HTTPS are request-response protocols:

1. Client sends an HTTP request (GET, POST, PUT, DELETE, etc.)
2. Server processes the request
3. Server sends an HTTP response (with status code and body)

For a deeper dive into web protocols and how modern web frameworks handle HTTP,
see our article on [WSGI vs ASGI](/blog/wsgi-vs-asgi)—it explores how Python web
applications process HTTP requests at scale.

## Common Network Tools

Several command-line tools help diagnose and troubleshoot network issues. Here
are the most essential ones:

### Ping

Ping tests whether a remote host is reachable and measures round-trip time. It
sends ICMP Echo Request packets and waits for Echo Reply responses.

```bash
# Ping Google's DNS server
ping -c 4 8.8.8.8

# Output:
# PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
# 64 bytes from 8.8.8.8: icmp_seq=1 ttl=119 time=15.3 ms
# 64 bytes from 8.8.8.8: icmp_seq=2 ttl=119 time=14.8 ms
# 64 bytes from 8.8.8.8: icmp_seq=3 ttl=119 time=15.1 ms
# 64 bytes from 8.8.8.8: icmp_seq=4 ttl=119 time=15.2 ms
```

### Traceroute

Traceroute shows the path packets take to reach a destination, displaying each
hop (router) along the way. This helps identify where network problems occur.

```bash
# Trace route to example.com
traceroute example.com

# Output shows each hop:
# 1  gateway (192.168.1.1)  1.234 ms
# 2  isp-router (203.0.113.1)  5.678 ms
# 3  backbone-1.net (198.51.100.1)  12.345 ms
# ... and so on until reaching the destination
```

### Nslookup

Nslookup queries DNS servers to resolve domain names to IP addresses. It's
useful for troubleshooting DNS issues.

```bash
# Look up A record for example.com
nslookup example.com

# Output:
# Server:  8.8.8.8
# Address: 8.8.8.8#53
#
# Non-authoritative answer:
# Name:   example.com
# Address: 93.184.216.34
# Address: 2606:2800:220:1:248:1893:25c8:1946

# Query specific record type
nslookup -type=MX example.com
```

### Netstat

Netstat displays active network connections, listening ports, and network
statistics. It's essential for understanding what network activity is happening
on your system.

```bash
# List all listening ports and established connections
netstat -tulpn

# Output columns:
# Proto  Local Address  Foreign Address  State
# tcp    0.0.0.0:22     0.0.0.0:*        LISTEN
# tcp    0.0.0.0:80     0.0.0.0:*        LISTEN
# tcp6   ::1:3000       ::1:54321        ESTABLISHED

# Find what's listening on a specific port
netstat -tulpn | grep 8080
```

### Additional Tools

Other valuable tools for network diagnostics include:

- **ifconfig/ip**: Display network interface configuration
- **netcat**: Read/write data across networks
- **curl/wget**: Fetch resources from URLs
- **dig**: Advanced DNS lookup tool
- **mtr**: Combines ping and traceroute functionality

## Final Thoughts

Networking is a vast field, but understanding these fundamentals—the TCP/IP and
OSI models, IP addressing, DNS, and common protocols—gives you a solid
foundation for working with networked systems. Whether you're developing web
applications, managing infrastructure, or troubleshooting connectivity issues,
these concepts form the basis of modern digital communication.

The TCP/IP model represents how the internet actually works in practice, while
the OSI model provides a more granular view of each communication layer.
Together, they help explain both the "what" and the "how" of network
communication. As you deepen your networking knowledge, you'll find yourself
returning to these fundamental concepts repeatedly.

## References

- Kurose, J. F., & Ross, K. W. (2020). _Computer Networking: A Top-Down
  Approach_ (8th ed.). Pearson.
- Internet Engineering Task Force (IETF). (1981). _RFC 791: Internet Protocol_.
  Retrieved from <https://tools.ietf.org/html/rfc791>
- Internet Engineering Task Force (IETF). (1981). _RFC 793: Transmission Control
  Protocol_. Retrieved from <https://tools.ietf.org/html/rfc793>
- Cloudflare Learning Center. (2026). _Network Fundamentals_. Retrieved from
  <https://learning.cloudflare.com/>
