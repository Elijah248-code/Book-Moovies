const API_BASE_URL = 'http://localhost:3000/api'

// Interface pour les films
interface Film {
  id: number
  Titre: string
  Realisateur: string
  Acteur: string
  Categorie: string
  Note: number
  Nombre_note: number
}

// Interface pour l'authentification
interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
}

interface AuthResponse {
  message: string
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

// Fonction pour récupérer les films
export async function getFilms(): Promise<Film[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/films`)
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error)
    throw error
  }
}

// Fonction pour l'inscription
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de l\'inscription')
    }
    
    return result
  } catch (error) {
    console.error('Erreur inscription:', error)
    throw error
  }
}

// Fonction pour la connexion
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de la connexion')
    }
    
    return result
  } catch (error) {
    console.error('Erreur connexion:', error)
    throw error
  }
}

// Fonction pour récupérer le profil (avec token)
export async function getProfile(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de la récupération du profil')
    }
    
    return result
  } catch (error) {
    console.error('Erreur profil:', error)
    throw error
  }
}
