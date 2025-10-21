export default async function ResetPasswordEmail(props: { resetUrl: string }) {
  return (
    <>
      <div
        style={{
          width: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgb(0, 51, 255)',
            padding: '25px 30px',
            textAlign: 'center'
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 600,
              margin: 0
            }}
          >
            orzpass
          </h1>
        </div>

        <div style={{ padding: '30px' }}>
          <p
            style={{
              marginBottom: '20px',
              fontSize: '18px',
              marginTop: 0,
              color: '#555555'
            }}
          >
            Hello,
          </p>

          <div
            style={{
              marginBottom: '30px',
              color: '#555555',
              fontSize: '16px'
            }}
          >
            <p
              style={{
                marginBottom: '15px',
                marginTop: 0
              }}
            >
              We received a request to reset the password for your account. If you made this request, please click the
              button below to reset your password:
            </p>
          </div>

          <div
            style={{
              textAlign: 'center',
              margin: '30px 0'
            }}
          >
            <a
              href={props.resetUrl}
              style={{
                display: 'inline-block',
                backgroundColor: 'rgb(0, 51, 255)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 500
              }}
              target="_blank"
              rel="noreferrer"
            >
              Reset My Password
            </a>
          </div>

          <div
            style={{
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid #eeeeee',
              color: '#777777',
              fontSize: '14px'
            }}
          >
            <p
              style={{
                marginBottom: '10px',
                marginTop: 0,
                color: '#555555'
              }}
            >
              If you&apos;re unable to click the button above, please copy and paste the following link into your
              browser&apos;s address bar:
            </p>
            <p
              style={{
                color: '#3498db',
                textDecoration: 'underline',
                marginBottom: '10px',
                marginTop: 0
              }}
            >
              {props.resetUrl}
            </p>

            <p
              style={{
                marginBottom: '10px',
                marginTop: 0,
                color: '#555555'
              }}
            >
              This reset link will expire in 24 hours. If you did not request a password reset, you can safely ignore
              this email and your password will remain unchanged.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
