export default function LaunchIcon({ name = 'elements', className = '' }) {
  return <span className={`lf-icon ${className}`} aria-hidden="true"><img src={`/images/launch/${name}.svg`} alt="" /></span>;
}
