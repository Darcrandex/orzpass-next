export default function ResetPasswordEmail(props: { sign: string }) {
  return (
    <>
      <div className="w-xl bg-white p-4 shadow-xl">
        <h1>Reset Password Email</h1>
        <p>sign: {props.sign}</p>
      </div>
    </>
  )
}
