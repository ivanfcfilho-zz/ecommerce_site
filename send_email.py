import smtplib

def send_email(user, pwd, recipient, subject, body):

	FROM = user
	TO = recipient if isinstance(recipient, list) else [recipient]
	SUBJECT = subject
	TEXT = body

	# Prepare actual message
	message = """From: %s\nTo: %s\nSubject: %s\n\n%s
	""" % (FROM, ", ".join(TO), SUBJECT, TEXT)
	try:
		server = smtplib.SMTP("smtp.gmail.com", 587)
		server.ehlo()
		server.starttls()
		server.login(user, pwd)
		server.sendmail(FROM, TO, message)
		server.close()
		print('successfully sent the mail')
	except:
		print("failed to send mail")

if __name__ == "__main__":
	send_email("from@gmail.com", "from_password", "to@gmail.com", "Subject", "body")
