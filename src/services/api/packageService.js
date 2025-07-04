import packagesData from '@/services/mockData/packages.json'

class PackageService {
  constructor() {
    this.packages = packagesData
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.packages]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const package_item = this.packages.find(pkg => pkg.Id === id)
    if (!package_item) {
      throw new Error('Package not found')
    }
    return { ...package_item }
  }

  async create(packageData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newPackage = {
      ...packageData,
      Id: Math.max(...this.packages.map(pkg => pkg.Id)) + 1
    }
    this.packages.push(newPackage)
    return { ...newPackage }
  }

  async update(id, packageData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.packages.findIndex(pkg => pkg.Id === id)
    if (index === -1) {
      throw new Error('Package not found')
    }
    this.packages[index] = { ...this.packages[index], ...packageData }
    return { ...this.packages[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.packages.findIndex(pkg => pkg.Id === id)
    if (index === -1) {
      throw new Error('Package not found')
    }
    this.packages.splice(index, 1)
    return true
  }
}

export const packageService = new PackageService()