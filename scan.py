# scan.py
# Scans the network and gets a list of devices on the network
# 6/16/2014

# Requirements
# Nmap: 
# Requests: http://docs.python-requests.org/en/latest/user/install/

# Imports
import nmap
import requests

# Scans the network for all devices
# Returns the result in an array
def scan_for_devices():

    # Init
    nm = nmap.PortScanner()

    # Scan (Host Discovery)  http://nmap.org/book/man-host-discovery.html
    # http://nmap.org/book/man-briefoptions.html
    # -sn: Ping Scan - disable port scan
    nm.scan(hosts='192.168.8.0/24', arguments='-sn')

    for host in nm.all_hosts():
        print nm[host]

    # Process Results
    hosts_list = [(x, nm[x]['status']['state']) for x in nm.all_hosts()]
    for host, status in hosts_list:
	   print('{0}:{1}'.format(host, status))


scan_for_devices()

'''
Newly joined people (5 min)
List of people on previous scan
List of current people


when client connects
	send list of current people
	send list of newly joined people

on scan
	calculate list of newly joined people
	send list of current people
	send list of newly joined people
    '''