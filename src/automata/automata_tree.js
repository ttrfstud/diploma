var skip        = require('./skip');
var atom_hetatm = require('./atom_hetatm');
var model       = require('./model');

module.exports = {
	H: {
		E: {
			A: {
				D: {
					E: {
						R: skip
					}
				}
			},
			T: {
				' ': {
					' ': {
						' ': skip
					},
				},
				N: {
					A: {
						M: skip
					}
				},
				S: {
					Y: {
						N: skip
					}
				},
				A: {
					T: {
						M: atom_hetatm
					}
				}
			},
			L: {
				I: {
					X: {
						' ': skip
					}
				}
			}
		}
	},

	O: {
		B: {
			S: {
				L: {
					T: {
						E: skip
					}
				}
			}
		},
		R: {
			I: {
				G: {
					X: {
						1: skip,
						2: skip,
						3: skip
					}
				}
			}
		}
	},

	T: {
		I: {
			T: {
				L: {
					E: {
						' ': skip
					}
				}
			}
		},
		E: {
			R: {
				' ': {
					' ': {
						' ': skip
					}
				}
			}
		}
	},

	S: {
		P: {
			L: {
				I: {
					T: {
						' ': skip
					}
				}
			},
			R: {
				S: {
					D: {
						E: skip
					}
				}
			}
		},
		O: {
			U: {
				R: {
					C: {
						E: skip
					}
				}
			}
		},
		E: {
			Q: {
				A: {
					D: {
						V: skip
					}
				},
				R: {
					E: {
						S: skip
					}
				}
			}
		},
		H: {
			E: {
				E: {
					T: {
						' ': skip
					}
				}
			}
		},
		S: {
			B: {
				O: {
					N: {
						D: skip
					}
				}
			}
		},
		I: {
			T: {
				E: {
					' ': {
						' ': skip
					}
				}
			}
		},
		C: {
			A: {
				L: {
					E: {
						1: skip,
						2: skip,
						3: skip
					}
				}
			}
		}
	},

	C: {
		A: {
			V: {
				E: {
					A: {
						T: skip
					}
				}
			}
		},
		O: {
			M: {
				P: {
					N: {
						D: skip
					}
				}
			},
			N: {
				E: {
					C: {
						T: skip
					}
				}
			}
		},
		I: {
			S: {
				P: {
					E: {
						P: skip
					}
				}
			}
		},
		R: {
			Y: {
				S: {
					T: {
						1: skip
					}
				}
			}
		}
	},
	K: {
		E: {
			Y: {
				W: {
					D: {
						S: skip
					}
				}
			}
		}
	},
	E: {
		X: {
			P: {
				D: {
					T: {
						A: skip
					}
				}
			}
		},
		N: {
			D: {
				M: {
					D: {
						L: skip
					}
				},
				' ': {
					' ': {
						' ': skip
					}
				}
			}
		}
	},
	N: {
		U: {
			M: {
				M: {
					D: {
						L: skip
					}
				}
			}
		}
	},

	M: {
		D: {
			L: {
				T: {
					Y: {
						P: skip
					}
				}
			}
		},
		T: {
			R: {
				I: {
					X: {
						1: skip,
						2: skip,
						3: skip
					}
				}
			}
		},
		O: {
			D: {
				R: {
					E: {
						S: skip
					}
				},
				E: {
					L: {
						' ': model
					}
				}
			}
		},
		A: {
			S: {
				T: {
					E: {
						R: skip
					}
				}
			}
		}
	},

	A: {
		U: {
			T: {
				H: {
					O: {
						R: skip
					}
				}
			}
		},
		T: {
			O: {
				M: {
					' ': {
						' ': atom_hetatm
					}
				}
			}
		},
		N: {
			I: {
				S: {
					O: {
						U: skip
					}
				}
			}
		}
	},

	R: {
		E: {
			V: {
				D: {
					A: {
						T: skip
					}
				}
			},
			M: {
				A: {
					R: {
						K: skip
					}
				}
			}
		}
	},
	J: {
		R: {
			N: {
				L: {
					' ': {
						' ': skip
					}
				}
			}
		}
	},
	D: {
		B: {
			R: {
				E: {
					F: {
						' ': skip
					}
				}
			}
		}
	},
	F: {
		O: {
			R: {
				M: {
					U: {
						L: skip
					}
				}
			}
		}
	},
	L: {
		I: {
			N: {
				K: {
					' ': {
						' ': skip
					}
				}
			}
		}
	}
}