---
title: Cybersecurity Basics
pubDate: 2024-11-04
description: "Cybersecurity Basics"
tags: ["cybersecurity"]
isDraft: true
snippet:
  language: "bash"
  code: "nmap -sV -sC -p- 10.10.10.10"
---

In today's interconnected digital landscape, cybersecurity has become a critical
concern for individuals and organizations alike. Let's explore the most common
cyber threats and the essential security controls needed to protect digital assets.

## Part 1: Understanding Cyber Threats

### Ransomware

Ransomware is malicious software that encrypts a victim's files, making them
inaccessible until a ransom is paid. Notable examples include WannaCry and
CryptoLocker. These attacks have evolved from targeting individuals to disrupting
critical infrastructure and large organizations.

### Malware

Malware encompasses various malicious software types designed to damage systems
or gain unauthorized access:

- **Viruses**: Self-replicating code that attaches to legitimate programs
- **Worms**: Self-propagating malware that spreads across networks independently
- **Trojans**: Malicious programs disguised as legitimate software
- **Spyware**: Software that covertly monitors user activity
- **Adware**: Unwanted software displaying advertising content

### Social Engineering

Social engineering exploits human psychology rather than technical vulnerabilities.
Attackers manipulate people into breaking security protocols, revealing sensitive
information, or installing malware. These attacks leverage trust and often create
a sense of urgency to bypass rational decision-making.

### Phishing

Phishing attacks use fraudulent communications that appear to come from reputable
sources. They typically seek to steal sensitive data like login credentials and
credit card details. Variants include:

- **Spear phishing**: Targeted attacks customized for specific individuals
- **Whaling**: Phishing attempts targeting high-profile executives
- **Vishing**: Voice-based phishing over phone calls
- **Smishing**: SMS-based phishing messages

### Denial of Service (DoS) and Distributed DoS (DDoS)

These attacks overwhelm systems, servers, or networks with traffic to disrupt services.
DDoS attacks launch from multiple compromised devices, making them particularly
difficult to mitigate. Modern attacks can exceed terabits per second, enough to take
down major online platforms.

### Man-in-the-Middle (MitM) Attacks

In MitM attacks, cybercriminals intercept communication between two parties to steal
data or impersonate one party. Common vectors include unsecured public Wi-Fi networks
and compromised routers. These attacks can be particularly devastating when targeting
financial transactions or sensitive communications.

## Part 2: Essential Security Controls

### Firewalls

Firewalls monitor and filter incoming and outgoing network traffic based on
predetermined security rules. Types include:

- **Network firewalls**: Protect entire networks
- **Host-based firewalls**: Protect individual devices
- **Next-generation firewalls (NGFW)**: Combine traditional firewall
  capabilities with advanced features like intrusion prevention and deep packet
  inspection

### Access Control

Access control mechanisms ensure users can only access resources they're
authorized to use:

- **Authentication**: Verifying user identity (passwords, biometrics, tokens)
- **Authorization**: Determining user access permissions
- **Accounting**: Tracking user activities and resource usage
- **Principle of least privilege**: Users receive only the minimum permissions necessary

### Intrusion Prevention/Detection Systems (IPS/IDS)

- **IDS**: Monitors network traffic for suspicious activity and issues alerts
- **IPS**: Actively prevents or blocks detected intrusions
- **Network-based systems**: Monitor network traffic
- **Host-based systems**: Monitor activity on individual systems

### Security Information and Event Management (SIEM)

SIEM systems collect and analyze security data from multiple sources,
enabling real-time monitoring, threat detection, and incident response. Modern SIEM
solutions incorporate AI and machine learning to identify complex attack patterns.

### Data Backup and Recovery

Regular data backups are crucial for recovering from ransomware and other attacks.
The 3-2-1 backup strategy recommends:

- 3 copies of data
- 2 different media types
- 1 copy stored off-site

### Cryptography and Encryption

Encryption converts readable data into encoded ciphertext that can only be decrypted
with the correct key:

- **Symmetric encryption**: Uses the same key for encryption and decryption
- **Asymmetric encryption**: Uses public and private key pairs
- **End-to-end encryption**: Only communicating users can read messages
- **Data at rest encryption**: Protects stored data

### Virtual Private Networks (VPNs)

VPNs create secure, encrypted connections over less secure networks like the internet.
They protect data in transit and can mask user location and IP address, enhancing
privacy and security.

### Endpoint Protection

Endpoint security solutions protect devices connecting to a network:

- **Antivirus/anti-malware software**
- **Host-based firewalls**
- **Endpoint detection and response (EDR)**
- **Device encryption**
- **Application control**

### Business Continuity Planning (BCP)

BCP ensures critical business functions continue during and after a security incident:

- **Risk assessment and business impact analysis**
- **Recovery strategies and procedures**
- **Regular testing and updates**
- **Incident response planning**

#### Business Impact Analysis (BIA)

BIA is a process that identifies the critical business processes and assets that
are most important to the organization. It helps to determine the potential impact
of a security incident and to develop a plan for responding to it.

- Main functions of the business.
- ROT and RPO.
- Required Assets for business functions.
- Financial impact of the incident.
- Operational impact of the incident.
- Legal and regulatory impact of the incident.

#### Risk Analysis

- Identify threats, vulnerabilities and information risks.
- Likelihood of the risk event occurring and the impact.
- Controls and cost for each risk.

#### Recovery Plan

- Events needed to implement the recovery plan.
- Team responsible for incident response.
- Incidents recovery plan
  - vital assets
  - recovery manual
  - manual operation
- Contacts list

#### Test and maintain

- Test the recovery plan periodically.
- Update the recovery plan when necessary.
- Train the team on the recovery plan.

### Data Loss Prevention (DLP)

DLP strategies protect sensitive data from unauthorized access or exfiltration:

- **Content inspection and contextual analysis**
- **Monitoring data in motion, at rest, and in use**
- **Policy enforcement and reporting**

### Bring Your Own Device (BYOD) Security

As personal devices increasingly access corporate resources, BYOD security
addresses associated risks:

- **Mobile device management (MDM)**
- **Containerization**
- **Remote wiping capabilities**
- **BYOD policies and compliance monitoring**

## Conclusion

Effective cybersecurity requires a multi-layered approach combining technological
solutions with human awareness. By understanding both common threats and essential
security controls, organizations can significantly improve their security posture
and reduce the risk of successful attacks.

Remember that cybersecurity is not a one-time implementation but an ongoing process
requiring regular assessment, updates, and training to address the constantly
evolving threat landscape.
