export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          Student Practicum Report Management System
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Backend API Server
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '4px',
            border: '1px solid #bae6fd'
          }}>
            <strong>API Endpoints:</strong>
            <br />
            <code>/api/login</code>
            <br />
            <code>/api/reports</code>
            <br />
            <code>/api/admin</code>
          </div>
        </div>
        <p style={{ 
          marginTop: '2rem', 
          fontSize: '0.9rem', 
          color: '#888' 
        }}>
          This is the backend server. Use the frontend application to interact with the system.
        </p>
      </div>
    </div>
  )
}