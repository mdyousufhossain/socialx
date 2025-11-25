import nodemailer from 'nodemailer'

export async function POST (request: Request) {
  const body = await request.json()
  const { firstName, lastName, companyName, businessType, comments } = body

  // Set up Nodemailer transporter
  // recovery code L3XXUBQUGP3WL3YXQQHYRQHB
  const transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com', // Replace with SMTP server
    port: 2525,
    secure: false,
    auth: {
      user: 'yousafhossain3@gmail.com',
      pass: '6ACE5701E103429E3F7365889BCF9B057CDB'
    }
  })

  // Set up email options
  const mailOptions = {
    from: '"dude" <yousafhossain3@gmail.com>',
    to: 'yousafhossain3@gmail.com',
    subject: 'New Form Submission',
    text: `
      First Name: ${firstName}
      Last Name: ${lastName}
      Company Name: ${companyName}
      Business Type: ${businessType}
      Comments: ${comments}
    `
  }

  try {
    // Send email
    await transporter.sendMail(mailOptions)
    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
